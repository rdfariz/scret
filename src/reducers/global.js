const initialState = {
  loading: false
}

export default function selected(state = initialState, action) {
  const { type, loading } = action
  switch (type) {
    case "SET_LOADING":
      return {
        ...state,
        loading
      };
    default:
      return state
  }
}