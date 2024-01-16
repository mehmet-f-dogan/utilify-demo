import { Todo } from "@prisma/client";
import useSWR, { SWRResponse, mutate } from "swr";

const fetcher = async (...args: Parameters<typeof fetch>) => {
    const res = await fetch(...args);
    return res.json();
};

export function useTodos(): {
    todos: Todo[] | undefined;
    isLoading: boolean;
    isError: any;
    mutateTodos: () => Promise<void>;
} {
    const { data, error, isValidating: isLoading }: SWRResponse<Todo[], any> = useSWR(`/api/todos`, fetcher);

    const mutateTodos = async () => {
        await mutate(`/api/todos`);
    };

    return {
        todos: data,
        isLoading,
        isError: error,
        mutateTodos,
    };
}
