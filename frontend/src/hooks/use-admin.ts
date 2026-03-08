import { deleteUser, editUser, getAllUsers } from '@/services/admin.service';
import { EditUser, User } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ---------------- GET ALL USERS (ADMIN) ----------------
export const useGetAllUsers = () => {
  return useQuery<User[]>({
    queryKey: ['allUsers'],
    queryFn: getAllUsers,
  });
};

// ---------------- EDIT USER (ADMIN) ----------------
export const useEditUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, unknown, { id: string; data: EditUser }>({
    mutationFn: ({ id, data }) => editUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
};

// ---------------- DELETE USER (ADMIN) ----------------
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, { id: string }>({
    mutationFn: ({ id }) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
};
