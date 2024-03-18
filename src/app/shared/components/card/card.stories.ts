import { Meta, StoryObj, argsToTemplate, moduleMetadata } from "@storybook/angular";
import { CardComponent } from "./card.component";
import { TranslateModule } from "@ngx-translate/core";
import { CardModule } from "./card.module";

type StoryType = CardComponent & { content?: string };
const meta: Meta<CardComponent> = {
  title: 'Cards',
  component: CardComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [
        CardModule,
        TranslateModule.forRoot(),
      ],
      providers: []
    }),
  ],
  render: (args) => ({
    props: {
      ...args,
    },
    template: `
      <neo-card ${argsToTemplate(args)}>
        <span>Contenido de la card</span>
      </neo-card>
      `
  }),
  argTypes: {
    collapsed: {
      control: { type: null }
    },
    _isCollapsed: {
      table: { disable: true }
    },
    isCollapsedIcon: {
      control: { type: null }
    },
    neoCardHeader: {
      control: { type: null }
    },
    toggleCollapse: {
      control: { type: null }
    },
    collapse: {
      control: { type: null }
    },
    expand: {
      control: { type: null }
    }
  },
};

export default meta;
type Story = StoryObj<CardComponent>;

export const Card: Story = {
  name: 'Card sin cabecera',
  args: {},
};

export const CardWithHeader: Story = {
  name: 'Card con cabecera',
  args: { },
  render: (args: StoryType) => ({
    props: args,
    template: `
    <neo-card ${argsToTemplate(args)}>
      <neo-card-header>
        <div>Texto de cabecera</div>
      </neo-card-header>
      <span>Contenido de la card</span>
    </neo-card>
    `
  })
};
