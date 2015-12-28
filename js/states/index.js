import Baobab, {monkey} from 'baobab';

const defaultState = {
  user: {
    status: {
      authenticated: false
    }
  }
};

const tree = new Baobab(defaultState);

export default tree;
