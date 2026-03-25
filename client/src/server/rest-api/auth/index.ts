
import {

    queryOptions,
    useMutation,
    useQuery,
    useQueryClient,

} from "@tanstack/react-query";
import { BetterAuthError } from "better-auth";
import { authClient as auth } from "./lib";
import type { EmailAndPasswordLoginProps } from "./types";
import { QUERY_KEYS } from "#/constants/query-keys";

export const useEmailAndPasswordLogin = () => {
  return useMutation({
    mutationFn: async ({ email, password }: EmailAndPasswordLoginProps) => {
      const res = await auth.signIn.email({
        email,
        password,
        callbackURL: window.location.origin,
      });

      if (res.error) {
        throw new Error(res.error.message);
      }

      return res.data;
    },
  });
};
export const querySessionOptions = queryOptions({
  queryKey: QUERY_KEYS.auth.session(),
  queryFn: async () => {
    const res = await auth.getSession();

    if (res.error?.code) {
      throw new BetterAuthError(res.error.code);
    }

    if (res.error) {
      throw new Error(res.error.message);
    }

    return res.data ?? null;
  },
  retry: false,
});

export const useUser = () => {
  const { data: session } = useQuery(querySessionOptions);
  return session?.user ?? null;
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await auth.signOut();

      if (res.error) {
        throw new Error(res.error.message);
      }

      return res.data;
    },

    onSuccess: () => {
      // Invalidate session & user
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.auth.session(),
      });

      // Optional: clear everything (strong reset)
      // queryClient.clear();
    },
  });
};

// this is useful when anonymous user can access the page but we want to show different UI based on the authentication status
// export const useRevokeSession = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (
//       params: Parameters<typeof auth.multiSession.revoke>[0],
//     ) => {
//       const res = await auth.multiSession.revoke(params);
//       if (res.error) {
//         throw new Error(res.error?.message || "Failed to revoke session");
//       }

//       await queryClient.invalidateQueries(querySessionOptions);

//       return res.data;
//     },
//   });
// };
// export const listSessionsOptions = queryOptions({
//   queryKey: QUERY_KEYS.auth.sessions(),
//   queryFn: async () => {
    
//     const res = await auth.multiSession.listDeviceSessions();
//     if (res.error) {
//       throw new Error(res.error.message);
//     }
//     return res.data;
//   },
// });

// export const useSetActiveSession = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (
//       args: Parameters<typeof auth.multiSession.setActive>[0],
//     ) => {
//       const res = await auth.multiSession.setActive(args);
//       if (res.error) {
//         throw new Error(res.error.message);
//       }

//       await queryClient.invalidateQueries(querySessionOptions);

//       return res.data;
//     },
//   });
// };