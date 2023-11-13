import {Grid} from "@mui/material";
import {createContext, ReactNode} from "react";
import {
    gql,
    useQuery,
    useMutation,

} from "@apollo/client";
import {WhiteTypography} from "./UserContext";

const LOADING_MESSAGE = (
    <Grid height="100vh" width="100vw" container justifyContent="center" alignItems="center">
        <Grid item>
            <WhiteTypography>Loading sets and roles...</WhiteTypography>
        </Grid>
    </Grid>
);


const GET_MY_SETS = gql`
  query GetMySets {
    getmysets {
      creatorId
      name
      stringifiedArray
      visibility
      _id
      createdAt
      updatedAt
    }
  }
`;

const ADD_SET = gql`
  mutation AddSet($name: String!, $stringifiedArray: String!) {
    addset(name: $name, stringifiedArray: $stringifiedArray)
  }
`;

const PUBLISH_SET = gql`
  mutation PublishSet($setId: String!) {
    publishset(setId: $setId)
  }
`;


const GET_MY_ROLES = gql`
  query Getmyroles {
      getmyroles {
        creatorId
        role
        setId
        category
        description
        aiMessage
        visibility
        _id
        createdAt
        updatedAt
      }
 }
`;

const ADD_ROLE = gql`
    mutation Addrole($role: String!, $category: String!, $description: String!, $name: String) {
      addrole(role: $role, category: $category, description: $description, name: $name)
    }
`;

interface RNDContextType {
    loadingsets: boolean;
    errorsets?: Error;
    datasets: any;
    refetchsets: Function;
    loading: boolean,
    error?: Error,
    data: any,
    refetch: Function,
    addRole: Function,
    addSet: Function,
    publishSet: Function

}

const defaultValue: RNDContextType = {
    loadingsets: true,
    datasets: undefined,
    refetchsets: () => {
    },
    loading: true,
    data: undefined,
    refetch: () => {
    },
    addRole: () => {
    },
    addSet: () => {
    },
    publishSet: () => {
    }
};

const RNDContext = createContext<RNDContextType>(defaultValue);

export const RNDContextProvider = ({children}: { children: ReactNode }) => {

    const {loading, error, data, refetch} = useQuery(GET_MY_ROLES);
    const [addRole] = useMutation(ADD_ROLE, {
        refetchQueries: [GET_MY_ROLES],
    });

    const {loading: loadingsets, error: errorsets, data: datasets, refetch: refetchsets} = useQuery(GET_MY_SETS);
    const [addSet] = useMutation(ADD_SET, {refetchQueries: [GET_MY_SETS]});
    const [publishSet] = useMutation(PUBLISH_SET);


    return (
        <RNDContext.Provider
            value={{
                loadingsets,
                errorsets,
                datasets,
                refetchsets,
                loading,
                error,
                data,
                refetch,
                addRole,
                addSet,
                publishSet
            }}>
            {loading ? LOADING_MESSAGE : children}
        </RNDContext.Provider>
    );
};

export default RNDContext;
