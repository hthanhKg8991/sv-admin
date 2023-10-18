import React from "react";
import queryString from "query-string";
import _ from "lodash";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

export const withRouteAction = (WrappedComponent, options = {}) => {
    return class RouteAction extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                loading: true,
                action: null,
                query: queryString.parse(window.location.search)
            };
        }

        componentDidMount() {
            const {query} = this.state;
            this.setAction(query.action || "");
        }

        componentWillReceiveProps(nextProps) {
            if (!_.isEqual(_.get(nextProps, 'location'), _.get(this.props, 'location'))) {
                const query = queryString.parse(_.get(nextProps, ['location', 'search']));

                this.setAction(query.action || "", query);
            }
        }

        setAction(action = null, query = null) {
            if (action !== this.state.action) {
                let activeAction = _.find(options.actions, (o) => (o.action === action));

                if (!activeAction) {
                    action = options.defaultAction;
                    activeAction = _.find(options.actions, (o) => (o.action === action));
                }

                if (activeAction) {
                    this.setState({
                        loading: false,
                        action: action,
                        ActionComponent: activeAction.component,
                    });
                }

                if (query) {
                    this.setState({query: query});
                }
            }
        }

        render() {
            const {ActionComponent, loading, query} = this.state;

            return (
                <>
                    {loading && (
                        <LoadingSmall/>
                    )}
                    {!loading && (
                        <WrappedComponent ActiveAction={ActionComponent} {...this.props} query={query}/>
                    )}
                </>
            )
        }
    }
}
