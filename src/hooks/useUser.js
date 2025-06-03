import { getUsers } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";

export const useUser = (filters) => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => getUsers(filters),
  });
};
