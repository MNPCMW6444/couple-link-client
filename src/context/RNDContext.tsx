import {createContext, ReactNode} from "react";
import {gql, useQuery, useMutation} from "@apollo/client";
import {Grid} from "@mui/material";
import {WhiteTypography} from "./UserContext";

const LOADING_MESSAGE = (
    <Grid height="100vh" width="100vw" container justifyContent="center" alignItems="center">
        <Grid item>
            <WhiteTypography>Loading sets and roles...</WhiteTypography>
        </Grid>
    </Grid>
);

const GET_MY_SETS = gql`
  query Getmysets {
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
  mutation Addset($name: String!, $stringifiedArray: String!) {
    addset(name: $name, stringifiedArray: $stringifiedArray)
  }
`;

const PUBLISH_SET = gql`
  mutation Publishset($setId: String!) {
    publishset(setId: $setId)
  }
`;

const ADD_ROLE = gql`
  mutation Addrole($role: String!,$setName: String!, $roleName: String!, $category: String!, $description: String!, $publicName: String) {
    addrole(role: $role, roleName: $roleName, setName:$setName, category: $category, description: $description, publicName: $publicName)
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
    const {loading, error, data, refetch} = useQuery(GET_MY_SETS);
    const [addRole] = useMutation(ADD_ROLE);
    const [addSet] = useMutation(ADD_SET, {refetchQueries: [GET_MY_SETS]});
    const [publishSet] = useMutation(PUBLISH_SET);

    return (
        <RNDContext.Provider
            value={{
                loadingsets: loading,
                errorsets: error,
                datasets: data,
                refetchsets: refetch,
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
