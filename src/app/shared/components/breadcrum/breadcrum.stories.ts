import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { BreadcrumComponent } from "./breadcrum.component";
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from "@angular/router/testing";

const meta: Meta<BreadcrumComponent> = {
  title: 'BreadCrum',
  component: BreadcrumComponent,
  decorators: [
    moduleMetadata({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      providers: []
    }),
  ],
  render: (args) => ({
    props: {
      ...args,
    },
  }),
  argTypes: {
    ngOnInit: {
      control: { type: null }
    },
  },
};

export default meta;
type Story = StoryObj<BreadcrumComponent>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const BreadCrum: Story = {
  name: 'Breadcrum',
  args: {
    breadcrumbs: [
      {
        label: 'Page',
        url: '/#'
      },
      {
        label: 'Page 2',
        url: '/#/#'
      }
    ]
  },
};
