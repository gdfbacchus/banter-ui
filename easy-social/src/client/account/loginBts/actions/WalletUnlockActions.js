import alt from "../utils/alt-instance";

class WalletUnlockActions {
    /** If you get resolved then the wallet is or was just unlocked.  If you get
        rejected then the wallet is still locked.

        @return nothing .. Just test for resolve() or reject()
    */
    unlock() {
        debugger;
        return dispatch => {
            return new Promise((resolve, reject) => {
                dispatch({resolve, reject});
            })
                .then(was_unlocked => {
                    //DEBUG  console.log('... WalletUnlockStore\tmodal unlock')
                    if (was_unlocked) WrappedWalletUnlockActions.change();
                })
                .catch(params => {
                    throw params;
                });
        };
    }

    lock() {
        return dispatch => {
            return new Promise(resolve => {
                dispatch({resolve});
            }).then(was_unlocked => {
                if (was_unlocked) WrappedWalletUnlockActions.change();
            });
        };
    }

    cancel() {
        return true;
    }

    change() {
        debugger;
        return true;
    }

    checkLock() {
        return true;
    }
}

var WrappedWalletUnlockActions = alt.createActions(WalletUnlockActions);
export default WrappedWalletUnlockActions;
