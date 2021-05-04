import React, { Component } from 'react';
import { Button, View, Text } from 'react-native';
import { Navigation, OptionsTopBarButton } from 'react-native-navigation';
import { ComponentProps } from './ComponentProps';
import store from './LayoutStore';
import LayoutStore from './LayoutStore';
import { VISIBLE_SCREEN } from '.';
import { NavigationButton } from './NavigationButton';

const { connect } = require('remx');

export const ComponentScreen = connect()(
  class extends Component<ComponentProps> {
    constructor(props: ComponentProps) {
      super(props);
    }

    isVisible(): boolean {
      return store.getters.isVisibleLayout(this.props.layoutNode);
    }

    renderTabBar() {
      if (!this.props.bottomTabs) return null;

      const bottomTabsOptions = this.props.bottomTabs.resolveOptions().bottomTabs;
      if (bottomTabsOptions?.visible === false) return null;
      const buttons = this.props.bottomTabs!.children!.map((child, i) => {
        const bottomTabOptions = child.resolveOptions().bottomTab;
        return (
          <Button
            key={`tab-${i}`}
            testID={bottomTabOptions?.testID}
            title={bottomTabOptions?.text || ''}
            onPress={() => store.setters.selectTabIndex(this.props.bottomTabs, i)}
          />
        );
      });

      return <View testID={bottomTabsOptions?.testID}>{buttons}</View>;
    }

    renderTopBar() {
      if (!this.props.stack) return null;

      const topBarOptions = this.props.layoutNode.resolveOptions().topBar;
      if (topBarOptions?.visible === false) return null;
      else {
        const component = topBarOptions?.title?.component;
        return (
          <View testID={topBarOptions?.testID}>
            <Text>{topBarOptions?.title?.text}</Text>
            <Text>{topBarOptions?.subtitle?.text}</Text>
            {this.renderButtons(topBarOptions?.leftButtons)}
            {this.renderButtons(topBarOptions?.rightButtons)}
            {component &&
              //@ts-ignore
              this.renderComponent(component.componentId!, component.name)}
          </View>
        );
      }
    }

    renderButtons(buttons: OptionsTopBarButton[] = []) {
      return buttons.map((button) => {
        return <NavigationButton button={button} componentId={this.props.layoutNode.nodeId} />
      });
    }

    renderBackButton() {
      const backButtonOptions = this.props.layoutNode.resolveOptions().topBar?.backButton;
      return (
        <Button
          testID={backButtonOptions?.testID}
          title={backButtonOptions && backButtonOptions.title ? backButtonOptions.title : ''}
          onPress={() => {
            LayoutStore.setters.pop(this.props.layoutNode.nodeId)
          }}
        />
      );
    }

    renderComponent(id: string, name: string, testID?: string) {
      //@ts-ignore
      const Component = Navigation.store.getComponentClassForName(name)!();
      //@ts-ignore
      const props = Navigation.store.getPropsForId(id);
      return (
        <View key={id} testID={testID}>
          <Component {...props} componentId={id} />
        </View>
      );
    }

    render() {
      //@ts-ignore
      const Component = Navigation.store.getWrappedComponent(this.props.layoutNode.data.name);
      return (
        <View testID={this.isVisible() ? VISIBLE_SCREEN : undefined}>
          {this.props.backButton && this.renderBackButton()}
          {this.renderTopBar()}
          {this.renderTabBar()}
          {this.isVisible() && (
            <View>
              {/* <Overdlays /> */}
            </View>
          )}
          <Component componentId={this.props.layoutNode.nodeId} />
        </View>
      );
    }
  }
);
