import React from 'react';
import _ from 'lodash';
import { mount } from 'enzyme';
import { DashboardPanelContainer } from './dashboard_panel_container';
import { DashboardViewMode } from '../dashboard_view_mode';
import { PanelError } from '../panel/panel_error';
import { store } from '../../store';
import {
  updateViewMode,
  setPanels, updateTimeRange,
} from '../actions';
import { Provider } from 'react-redux';
import { getEmbeddableFactoryMock } from '../__tests__/get_embeddable_factories_mock';

function getProps(props = {}) {
  const defaultTestProps = {
    panelId: 'foo1',
    embeddableFactory: getEmbeddableFactoryMock(),
  };
  return _.defaultsDeep(props, defaultTestProps);
}

beforeAll(() => {
  store.dispatch(updateViewMode(DashboardViewMode.EDIT));
  store.dispatch(updateTimeRange({ to: 'now', from: 'now-15m' }));
  store.dispatch(setPanels({ 'foo1': { panelIndex: 'foo1' } }));
});

test('renders an error when embeddableFactory.create throws an error', (done) => {
  const props = getProps();
  props.embeddableFactory.create = () => {
    return new Promise(() => {
      throw new Error('simulated error');
    });
  };
  const component = mount(<Provider store={store}><DashboardPanelContainer {...props} /></Provider>);
  setTimeout(() => {
    component.update();
    const panelError = component.find(PanelError);
    expect(panelError.length).toBe(1);
    done();
  }, 0);
});

