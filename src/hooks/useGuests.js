import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getAllGuests } from "../services/apiGuests";
export function useGuests() {
  const queryClient = useQueryClient();

  const { mutate: guests, isLoading } = useMutation({
    mutationFn: getAllGuests,
    onSuccess: () => {
      toast.success("New Guests Succesfully Created");
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isLoading, guests };
}
