import fetchHandler from "./fetchHandler";

const appUrl =
  process.env.AUTH_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");
const apiUrl = `${appUrl.replace(/\/$/, "")}/api`;
export const api = {
  users: {
    getAll: async () => {
      return await fetchHandler(`${apiUrl}/users`);
    },
    create: async (data: {
      name: string;
      username: string;
      email: string;
      image: string;
    }) => {
      return await fetchHandler(`${apiUrl}/users`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    getById: async (id: string) => {
      return await fetchHandler(`${apiUrl}/users/${id}`);
    },

    getByEmail: async (email: string) => {
      return await fetchHandler(`${apiUrl}/users/email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },
    update: async (
      id: string,
      data: {
        name?: string;
        username?: string;
        email?: string;
        image?: string;
      }
    ) => {
      return await fetchHandler(`${apiUrl}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return await fetchHandler(`${apiUrl}/users/${id}`, {
        method: "DELETE",
      });
    },
  },
  accounts: {
    getAll: async () => {
      return await fetchHandler(`${apiUrl}/accounts`);
    },
    create: async (data: {
      userId: string;
      name: string;
      image?: string;
      password?: string;
      provider: string;
      providerAccountId: string;
    }) => {
      return await fetchHandler(`${apiUrl}/accounts`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    getById: async (id: string) => {
      return await fetchHandler(`${apiUrl}/accounts/${id}`);
    },
    getByProviderAccountId: (providerAccountId: string) => {
      return fetchHandler(`${apiUrl}/accounts/provider`, {
        method: "POST",
        body: JSON.stringify({ providerAccountId }),
      });
    },
    update: async (
      id: string,
      data: {
        userId?: string;
        name?: string;
        image?: string;
        password?: string;
        provider?: string;
        providerAccountId?: string;
      }
    ) => {
      return await fetchHandler(`${apiUrl}/accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return await fetchHandler(`${apiUrl}/accounts/${id}`, {
        method: "DELETE",
      });
    },
  },
  auth: {
    signInWithOauth: async ({
      provider,
      providerAccountId,
      user,
    }: {
      provider: string;
      providerAccountId: string;
      user: {
        name: string;
        username: string;
        email: string;
        image: string;
      };
    }) => {
      return await fetchHandler(`${apiUrl}/auth/signin-with-oauth`, {
        method: "POST",
        body: JSON.stringify({
          provider,
          providerAccountId,
          user,
        }),
      });
    },
  },
};
