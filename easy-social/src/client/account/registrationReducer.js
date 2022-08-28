
const types =  {
  SET_IS_AV_REG_ACCOUNT: "SET_IS_AV_REG_ACCOUNT",
  CLEAR_REG_ACCOUNT: "CLEAR_REG_ACCOUNT",
  SET_IS_AV_REG_PASS: "SET_IS_AV_REG_PASS",
  RGISTRATION_START: "RGISTRATION_START",
  RGISTRATION_SUCCESS: "RGISTRATION_SUCCESS",
  RGISTRATION_ERROR: "RGISTRATION_ERROR",
  RESET_REGISTRATION: "RESET_REGISTRATION"
};

const initialState = {
  isAvailableAccount: false,
  isAvailablePassword: false,
  isProcessing: false,
  regStatus: '', //empty '' or 'success' or 'error',
  registeredAccount: null,
};


export default (state = initialState, action) => {
  switch (action.type) {
    case types.RGISTRATION_START:
      console.log("START REGISTRATION PROCESS");
      return {
        ...state,
        isProcessing: true
      };
    case types.RGISTRATION_SUCCESS:
      console.log("[BANTER] REGISTRATION SUCCESS : ", action.payload);
      return {
        ...state,
        isProcessing: false,
        regStatus: 'success',
        registeredAccount: action.payload.registeredAccount
      };
    case types.RGISTRATION_ERROR:
      console.log("REGISTRATION ERROR");
      return {
        ...state,
        isProcessing: false,
        regStatus: 'error'
      };

    case types.RESET_REGISTRATION:
      console.log("RESET REGISTRATION");
      return {
        ...state,
        isProcessing: false,
        regStatus: ''
      };

    case types.SET_IS_AV_REG_ACCOUNT:
      return {
        ...state,
        isAvailableAccount: action.payload.isAvailableAccount
      };
    case types.CLEAR_REG_ACCOUNT:
      return {
        ...state,
        isAvailableAccount: false
      };
    case types.SET_IS_AV_REG_PASS:
      console.log("REDUCER IS VALID PASSWORD: ",action.payload.isAvailablePassword);
      return {
        ...state,
        isAvailablePassword: action.payload.isAvailablePassword
      };

    default:
      return state;
  }
};

export const getIsAvailableAccount = state => state.isAvailableAccount;
export const getIsAvailablePassword = state => state.isAvailablePassword;
export const getIsProcessing = state => state.isProcessing;
export const getRegStatus = state => state.regStatus;
