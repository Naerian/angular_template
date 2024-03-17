import { Meta, StoryObj, argsToTemplate, moduleMetadata } from "@storybook/angular";
import { CardComponent } from "./card.component";
import { CardHeaderComponent } from "./card-header/card-header.component";
import { TranslateModule } from "@ngx-translate/core";
import { CardModule } from "./card.module";

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
  render: (args: CardComponent) => ({
    props: {
      ...args,
    },
    template: `
      <neo-card ${argsToTemplate(args)}>
        <neo-card-header>
          <div>Título de la card</div>
        </neo-card-header>
        <p>Contenido de la card</p>
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

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Card: Story = {
  name: 'Card',
  args: {},
};
