import { TemplateRef } from '@angular/core';
import { Meta, StoryObj, argsToTemplate } from "@storybook/angular";
import { ButtonComponent } from "./button.component";

type StoryType = ButtonComponent & { content?: string };
const meta: Meta<ButtonComponent> = {
  title: 'Botones',
  component: ButtonComponent,
  render: (args: ButtonComponent) => ({
    props: {
      ...args,
    },
    template: `
      <neo-button ${argsToTemplate(args)}>Botón</neo-button>
    `
  }),
  argTypes: {
    click: {
      control: { type: null }
    },
    _title: {
      table: { disable: true }
    },
    clickOnButton: {
      control: { type: null }
    },
    ngAfterViewInit: {
      table: { disable: true }
    },
    btnContent: {
      table: { disable: true }
    },
  },
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Button: Story = {
  name: 'Botón',
  args: {
    color: "primary",
    title: 'Título del botón',
  },
};

export const IconButton: Story = {
  name: 'Botón con icono',
  args: {
    color: "primary",
    title: 'Título del botón',
    mode: 'icon',
  },
  render: (args: StoryType) => ({
    props: args,
    template: `
      <neo-button ${argsToTemplate(args)}><i class="ri-arrow-up-line"></i></neo-button>
    `
  })
};
