import {getCandidates} from "../../redux/actions/putaways";
import {getBinLocationsAction} from "../../redux/actions/locations";

export interface OwnProps {
  navigation: any,
  route: any;
}

export interface StateProps {
  locations: any
  SelectedLocation: any
}

export interface DispatchProps {
  showScreenLoading: (message?: string) => void;
  hideScreenLoading: () => void;
  getBinLocationsAction: (callback?: ()=> void) => void;
  createPutawayOderAction: (data: any, callback?: ()=> void) => void
}

export type Props = OwnProps & StateProps & DispatchProps;

export interface State {
    selectedLocation: any,
    quantity: string
}