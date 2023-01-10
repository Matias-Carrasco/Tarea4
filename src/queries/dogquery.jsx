import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useBuscarInfoQuery() {
    return useQuery(["buscarInfoQuery"], buscarInfoQuery, {
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      keepPreviousData: false,
      enabled: true,
    });
}

export const buscarInfoQuery = async () => {
    let urlBase = "https://dog.ceo/api/breeds/image/random";
    const { data } = await axios.get(
      urlBase
    );

    return data.results.message;
};