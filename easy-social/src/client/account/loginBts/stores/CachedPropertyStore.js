import Immutable from "immutable";

import alt from "../utils/alt-instance";
import iDB from "../utils/idb-instance";
import BaseStore from "./BaseStore";
import CachedPropertyActions from "../actions/CachedPropertyActions";

class CachedPropertyStore extends BaseStore {
    constructor() {
        super();
        this.state = this._getInitialState();
        this.bindListeners({
            onSet: CachedPropertyActions.set,
            onGet: CachedPropertyActions.get
        });
        this._export("get", "reset");
    }

    _getInitialState() {
        return {
            props: Immutable.Map()
        };
    }

    get(name) {
        return this.onGet({name});
    }

    onSet({name, value}) {
        if (this.state.props.get(name) === value) return;
        var props = this.state.props.set(name, value);
        this.state.props = props;
        iDB.setCachedProperty(name, value).then(() => this.setState({props}));
    }

    onGet({name}) {
        var value = this.state.props.get(name);
        if (value !== undefined) return value;
        try {
            iDB.getCachedProperty(name, null).then(value => {
                var props = this.state.props.set(name, value);
                this.state.props = props;
                this.setState({props});
            });
        } catch (err) {
            console.error("getCachedProperty error:", err);
        }
    }

    reset() {
        this.state = this._getInitialState();
        this.setState(this.state);
    }
}

export var CachedPropertyStoreWrapped = alt.createStore(
    CachedPropertyStore,
    "CachedPropertyStore"
);
export default CachedPropertyStoreWrapped;
