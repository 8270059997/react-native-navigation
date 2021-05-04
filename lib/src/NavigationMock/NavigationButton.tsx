import React, { Component } from "react";
import { Button, TouchableOpacity } from "react-native";
import { Navigation, OptionsTopBarButton } from 'react-native-navigation';
import { events } from "./EventsStore";

interface ButtonProps {
    button: OptionsTopBarButton;
    componentId: string;
}

export const NavigationButton = class extends Component<ButtonProps> {
    ref = undefined;
    render() {
        const { button, componentId } = this.props;
        if (button.component) return this.renderButtonComponent();
        return (
            <Button
                testID={button.testID}
                key={button.id}
                title={button.text || ''}
                onPress={() =>
                    events.invokeNavigationButtonPressed({
                        buttonId: button.id,
                        componentId,
                    })
                }
            />
        )
    }

    renderButtonComponent() {
        const { button, componentId } = this.props;
        //@ts-ignore
        const buttonComponentId = button.component!.componentId;
        //@ts-ignore
        const Component = Navigation.store.getComponentClassForName(button.component.name)!();
        //@ts-ignore
        const props = Navigation.store.getPropsForId(buttonComponentId);
        return (
            <TouchableOpacity onPress={() => {
                if (this.ref) {
                    // @ts-ignore
                    this.invokeOnClick(this.ref!._reactInternalFiber.return.stateNode)
                }

                events.invokeNavigationButtonPressed({
                    buttonId: button.id,
                    componentId: componentId,
                })
            }
            } testID={button.testID} >
                <Component key={buttonComponentId} {...props} componentId={buttonComponentId} ref={(ref: any) => this.ref = ref} />
            </TouchableOpacity >
        );
    }

    invokeOnClick(stateNode: any) {
        if (stateNode.children) {
            // @ts-ignore
            stateNode.children.forEach(instance => {
                if (instance.internalInstanceHandle && instance.internalInstanceHandle.stateNode.props.onClick) {
                    instance.internalInstanceHandle.stateNode.props.onClick();
                }

                this.invokeOnClick(instance)
            });
        }
    }
};
