import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BreadcrumbComponent } from './breadcrumb.component';

const meta: Meta<BreadcrumbComponent> = {
  title: 'BreadCrumb',
  component: BreadcrumbComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      providers: [],
    }),
  ],
  render: (args) => ({
    props: {
      ...args,
    },
  }),
  argTypes: {
    ngOnInit: {
      control: { type: null },
    },
  },
};

export default meta;
type Story = StoryObj<BreadcrumbComponent>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const BreadCrumb: Story = {
  name: 'Breadcrumb',
  args: {
    breadcrumbs: [
      {
        label: 'Page',
        url: '/#',
      },
      {
        label: 'Page 2',
        url: '/#/#',
      },
    ],
  },
};
