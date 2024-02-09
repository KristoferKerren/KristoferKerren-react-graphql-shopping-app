export default function paginationField() {
  return {
    keyArgs: false, // tells Apollo we will take care of everything
    read(existing = [], { args }) {
      const { skip, first } = args;

      const items = existing.slice(skip, skip + first).filter((x) => x);

      if (items.length) {
        return items;
      }
      return false;
    },
    merge(existing, incoming, { args }) {
      // This runs when the Apollo client comes back from the network with our product
      const { skip, first } = args;
      const merged = existing ? existing.slice(0) : [];
      // Fill previos objects with empty
      for (let i = skip; i < skip + incoming.length; i += 1) {
        merged[i] = incoming[i - skip];
      }
      // Return merged items from cache and go back to read() function and try again
      return merged;
    },
  };
}
