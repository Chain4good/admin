import { getPosts } from "@/services/postService";
import { useQuery } from "@tanstack/react-query";

export const usePost = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });
};
