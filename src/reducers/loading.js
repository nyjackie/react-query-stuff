/**
 * src: https://medium.com/stashaway-engineering/react-redux-tips-better-way-to-handle-loading-flags-in-your-reducers-afda42a804c6
 */
const loadingReducer = (state = { isLoading: false }, action) => {
  const { type } = action;
  const matches = /([A-Z]+)_(REQUEST|SUCCESS|FAIL)/.exec(type);

  // not a *_REQUEST / *_SUCCESS / *_FAILURE actions, so we ignore them
  if (!matches) return state;

  const [, requestName, requestState] = matches;
  return {
    ...state,
    // Store whether a request is happening at the moment or not
    // e.g. will be true when receiving *_REQUEST
    //      and false when receiving *_SUCCESS / *_FAILURE
    [requestName]: requestState === 'REQUEST',
    // for more generic global loading state
    isLoading: requestState === 'REQUEST',
  };
};

export default loadingReducer;
