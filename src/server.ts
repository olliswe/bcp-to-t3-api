import express, { Request, Response } from 'express';
import cors from 'cors';
import { getBCPData, getT3PlayerData } from './legacy';
import axios from 'axios';

const app = express();
app.use(cors());

app.get('/v1', async (req: Request, res: Response) => {
  const firstName = req.query.firstName;
  const lastName = req.query.lastName;

  if (typeof firstName === 'string' && typeof lastName === 'string') {
    const { success, nickname } = await getT3PlayerData({ firstName, lastName });
    if (success) {
      res.send(nickname);
      return;
    }
  }
  res.send('Not found!');
});

app.get('/v1/event', async (req: Request, res: Response) => {
  const eventUrl = req.query.link;
  if (typeof eventUrl === 'string') {
    try {
      const bcpData = await getBCPData(eventUrl);
      const withNicknames = await Promise.all(
        bcpData.map(async (name) => {
          const { nickname } = await getT3PlayerData(name);
          return {
            ...name,
            nickname: nickname || 'unknown',
          };
        })
      );
      res.send({ success: true, names: withNicknames });
      return;
    } catch (error) {
      res.send({ success: false });
      return;
    }
  }
  res.send({ success: false });
});

const BCP_API_URL = 'https://pnnct8s9sk.execute-api.us-east-1.amazonaws.com/prod';

const getBcpEventInformation = async (eventId: string) => {
  const url = `${BCP_API_URL}/events/${eventId}`;
  const eventResponse = await axios.get(url);
  return eventResponse.data;
};

const buildBcpEventPlacingsUrl = (eventId: string, nextKey?: string) =>
  `${BCP_API_URL}/players?limit=100&eventId=${eventId}&placings=true&expand%5B%5D=team&expand%5B%5D=army${
    nextKey ? `&nextKey=${nextKey}` : ''
  }`;

const parsePlacingsData = (placingsData: any[]) =>
  placingsData.map((placing) => ({
    first_name: placing.firstName,
    last_name: placing.lastName,
    placing: placing.placing,
    team: placing.teamName || placing.team.name,
    faction: placing.armyName || placing.army.name,
    wins: placing.numWins,
    path_to_victory: placing.pathToVictory,
    bcp_user_id: placing.userId,
  }));

const getBcpEventPlacings = async (eventId: string) => {
  const allPlacings = [];
  let nextKey: string | undefined = undefined;
  let i = 0;
  while (i < 15) {
    i++;
    const url = buildBcpEventPlacingsUrl(eventId, nextKey);
    const placingsResponse = await axios.get(url);
    const placingsData = placingsResponse.data.data;
    if (placingsData.length === 0) {
      break;
    }
    allPlacings.push(...parsePlacingsData(placingsData));
    nextKey = placingsResponse.data.nextKey;
  }
  return allPlacings;
};

app.get('/v2/bcp-event', async (req: Request, res: Response) => {
  const eventId = req.query.eventId;
  if (!eventId) {
    res.status(400).send('Current password does not match');
    return;
  }
  try {
    const eventInformation = await getBcpEventInformation(eventId as string);
    const parsedEventInformation = {
      number_players: eventInformation.totalPlayers,
      number_rounds: eventInformation.numberOfRounds,
      tournament_name: eventInformation.name,
      tournament_date: eventInformation?.eventDate.substring(0, 10),
      game_size: eventInformation.pointsValue,
    };
    const eventPlacings = await getBcpEventPlacings(eventId as string);
    const finalEventData = eventPlacings.map((placing) => ({
      first_name: placing.first_name,
      last_name: placing.last_name,
      t3_nickname: '',
      placing: placing.placing,
      wins: placing.wins || 0,
      path_to_victory: placing.path_to_victory || 0,
      bcp_user_id: placing.bcp_user_id,
      city: '',
      team: placing.team,
      faction: placing.faction,
      number_players: parsedEventInformation.number_players,
      number_rounds: parsedEventInformation.number_rounds,
      tournament_name: parsedEventInformation.tournament_name,
      tournament_id: eventId,
      tournament_date: parsedEventInformation.tournament_date,
      game_size: parsedEventInformation.game_size || 'N/A',
    }));
    res.send({ success: true, data: finalEventData });
  } catch (error) {
    res.status(500).send(`Error fetching BCP data: ${(error as object).toString()}`);
    return;
  }
});

app.listen(3000, () => {
  console.log('Application started on port 3000!');
});
