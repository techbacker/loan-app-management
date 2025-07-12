export const config = {
  api: {
    loanApplicationEndpoint:
      import.meta.env.VITE_LOAN_APPLICATION_ENDPOINT ||
      'http://localhost:3001/api/applications',
  },
} as const;

export const getApiEndpoint = () => {
  const endpoint = config.api.loanApplicationEndpoint;

  if (!endpoint) {
    throw new Error(
      'VITE_LOAN_APPLICATION_ENDPOINT environment variable is not defined'
    );
  }

  return endpoint;
};
