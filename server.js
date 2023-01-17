import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { gql } from 'apollo-server';
import { user, chart } from './src/utils/dataList.js';
import { teams } from './src/utils/team.js'
import { supplies } from './src/utils/supplies.js';
// import { equipments } from './src/utils/equipments.js';

// 임시 equipments 데이터
let equipments = [
  {
    "id": "machanical",
    "used_by": "developer",
    "count": 24,
    "new_or_used": "used",
  },
  {
    "id": "pen tablet",
    "used_by": "designer",
    "count": 15,
    "new_or_used": "used",
  },
  {
    "id": "notebook",
    "used_by": "planner",
    "count": 37,
    "new_or_used": "new",
  },
  {
    "id": "mouse",
    "used_by": "designer",
    "count": 31,
    "new_or_used": "used",
  },
  {
    "id": "monitor",
    "used_by": "developer",
    "count": 20,
    "new_or_used": "used",
  },
  {
    "id": "whiteboard",
    "used_by": "planner",
    "count": 12,
    "new_or_used": "used",
  },
  {
    "id": "sketchboard",
    "used_by": "designer",
    "count": 48,
    "new_or_used": "new",
  },
];


// schema
// GraphQL 명세에서 사용될 데이터 및 요청 타입 지정
const typeDefs = gql`
  type Query {
    users: [UserList],
    hello: String,
    charts: [ChartData],
    teams: [Team],
    team(id: Int): Team,
    supplies: [Supply],
    equipments: [Equipment]
  }

  type Mutation {
    deleteEquipment(id: String): Equipment,
    addEquipment(id: String, used_by: String, count: Int, new_or_used: String): Equipment
    editEquipment(id: String, used_by: String, count: Int, new_or_used: String): Equipment
  }

  type ChartData {
    id: ID,
    number: Int,
  }

  type UserList {
    userId: ID,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    emailAddress: String,
    homepage: String,
  }

  type Team {
    id: Int,
    manager: String,
    office: String,
    extension_number: String,
    mascot: String,
    cleaning_duty: String,
    project: String,
    supplies: [Supply]
  }

  type Supply {
    id: ID,
    team: String,
  }
  
  type Equipment {
    id: String,
    used_by: String,
    count: Int,
    new_or_used: String,
  }
`;

// 서비스의 액션을 함수로 지정
// 요청에 따라 데이터를 반환, 입력, 수정, 삭제
// Query : GET
// Mutation : POST, DELETE, PUT 등
const resolvers = {
  Query: {
    charts: () => chart,
    users: () => user,
    hello: () => "hello",
    teams: () => teams.map((item) => { 
      item.supplies = supplies.filter((ele) => { 
        return ele.team === item.id;
      })
      return item;
    }),
    team: (parent, args, context, info) => teams.filter((item) => {
      return item.id === args.id;
    })[0],
    supplies: () => supplies,
    equipments : () => equipments
  },
  Mutation: {
    deleteEquipment: (parent, args, context, info) => {
      const deleted = equipments.filter((item) => {
        return item.id === args.id
      })[0];

      equipments = equipments.filter((item) => {
        return item.id !== args.id;
      })
      return deleted;
    },
    addEquipment: (parent, args, context, info) => {
      equipments.push(args);
      return args;
    },
    editEquipment: (parent, args, context, info) => {
      return equipments.filter((item) => {
        return item.id === args.id;
      }).map((ele) => {
        Object.assign(ele, args);
        return ele;
      })[0];
    }
  }
};



// typeDef와 resolver, playground를 인자로 받아 새로운 서버 생성
// Playground는 graphql IDE
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true
});


const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);