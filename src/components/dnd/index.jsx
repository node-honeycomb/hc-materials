import hoistNonReactStatics from 'hoist-non-react-statics';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';
import {DropItem} from './dropItem';
import {DragItem} from './dragItem';
/* eslint-disable new-cap */
const DnDContext = () => BaseComponent => {
  const Component = DragDropContext(HTML5Backend)(BaseComponent);
  return hoistNonReactStatics(Component, BaseComponent);
};
export {DropItem, DragItem, DnDContext};
