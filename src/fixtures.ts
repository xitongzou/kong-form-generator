import { deepIncludes } from './schema'

export const schema = {
  fields: [
    {
      label: 'Username',
      name: 'username',
      type: 'input',
      inputType: 'text',
      placeholder: 'Enter your username',
      help: 'The username'
    },
    {
      label: 'Protocols',
      name: 'protocols',
      type: 'select',
      help: 'the protocol',
      values: [
        {
          label: 'grpc',
          value: 'grpc'
        },
        {
          label: 'http',
          value: 'http'
        },
        {
          label: 'https',
          value: 'https'
        },
        {
          label: 'tcp',
          value: 'tcp'
        },
        {
          label: 'tls',
          value: 'tls'
        }
      ]
    },
    {
      label: 'Protocols_Radio',
      name: 'protocols_radio',
      type: 'radio',
      help: 'the protocol',
      value: '',
      items: [
        {
          label: 'grpc'
        },
        {
          label: 'http'
        },
        {
          label: 'https'
        },
        {
          label: 'tls'
        }
      ]
    },
    {
      label: 'Protocols_Checkbox',
      name: 'protocols_checkbox',
      type: 'checkbox',
      help: 'the protocol',
      value: '',
      items: [
        {
          label: 'grpc'
        },
        {
          label: 'http'
        },
        {
          label: 'https'
        },
        {
          label: 'tls'
        }
      ]
    },
    {
      label: 'Certificate Key',
      name: 'certificate',
      type: 'textarea',
      help: 'the cert'
    },
    {
      value: 'My Label',
      name: 'label',
      type: 'label',
      help: 'the label'
    },
    {
      value: 'Submit',
      name: 'submit',
      type: 'button'
    },
    {
      type: 'metric',
      name: 'datadog',
      showRemoveButton: false,
      newElementButtonLabelClasses: 'k-button btn-primary mt-2',
      fieldClasses: 'metrics-wrapper',
      fields: [{
        model: 'name',
        label: 'Name',
        type: 'select',
        items: [
          {
            label: 'request_count',
            value: 'request_count'
          },
          {
            label: 'request_size',
            value: 'request_size'
          },
          {
            label: 'response_size',
            value: 'response_size'
          },
          {
            label: 'latency',
            value: 'latency'
          },
          {
            label: 'status_count',
            value: 'status_count'
          },
          {
            label: 'unique_users',
            value: 'unique_users'
          },
          {
            label: 'request_per_user',
            value: 'request_per_user'
          },
          {
            label: 'upstream_latency',
            value: 'upstream_latency'
          },
          {
            label: 'kong_latency',
            value: 'kong_latency'
          }
        ]
      }, {
        model: 'stat_type',
        label: 'Stat Type',
        type: 'select',
        items: [
          {
            label: 'gauge',
            value: 'gauge'
          },
          {
            label: 'timer',
            value: 'timer'
          },
          {
            label: 'counter',
            value: 'counter'
          },
          {
            label: 'histogram',
            value: 'histogram'
          },
          {
            label: 'meter',
            value: 'meter'
          },
          {
            label: 'set',
            value: 'set'
          }
        ]
      }, {
        model: 'sample_rate',
        label: 'Sample Rate',
        type: 'input',
        inputType: 'number',
        id: 'sample_rate'
      }, {
        model: 'consumer_identifier',
        label: 'Consumer Identifier',
        type: 'select',
        items: [
          {
            label: 'consumer_id',
            value: 'consumer_id'
          },
          {
            label: 'custom_id',
            value: 'custom_id'
          },
          {
            label: 'username',
            value: 'username'
          }
        ]
      }, {
        model: 'tags',
        label: 'Tags',
        type: 'input',
        inputType: 'text'
      }]
    },
    {
      label: 'Retries',
      model: 'retries',
      type: 'input',
      inputType: 'number',
      default: 5,
      placeholder: 'Enter number of Retries'
    },
    {
      label: 'Advanced Fields',
      type: 'advanced',
      inputType: 'hidden',
      fields: [
        {
          label: 'Retries',
          model: 'retries',
          type: 'input',
          inputType: 'number',
          default: 5,
          placeholder: 'Enter number of Retries'
        },
        {
          label: 'Connect Timeout',
          model: 'connect_timeout',
          type: 'input',
          inputType: 'number',
          default: 60000,
          placeholder: 'Enter the Connection Timeout'
        },
        {
          label: 'Write Timeout',
          model: 'write_timeout',
          type: 'input',
          inputType: 'number',
          default: 60000,
          placeholder: 'Enter the Write Timeout'
        },
        {
          label: 'Read Timeout',
          model: 'read_timeout',
          type: 'input',
          inputType: 'number',
          default: 60000,
          placeholder: 'Enter the Read Timeout'
        },
        {
          label: 'Client Certificate',
          model: 'client_certificate',
          type: 'input',
          inputType: 'text',
          placeholder: 'Enter a Certificate ID'
        }
      ]
    },
    {
      type: 'array_card_container',
      showRemoveButton: false,
      newElementButtonLabelClasses: 'k-button btn-link mt-2 p-2',
      fieldClasses: 'array-card-container-wrapper',
      newElementButtonLabel: 'Add Bootstrap Server',
      label: 'Bootstrap Server(s)',
      placeholder: 'Enter a Bootstrap Server',
      help: 'A list of bootstrap servers',
      fields: [
        {
          label: 'Host',
          model: 'host',
          type: 'input',
          inputType: 'text'
        }, {
          label: 'Port',
          model: 'port',
          type: 'input',
          inputType: 'number'
        }
      ]
    },
    {
      label: 'Service',
      placeholder: 'Select A Service',
      type: 'autosuggest',
      valueType: 'object-expand',
      required: true,
      entity: 'services',
      inputValues: {
        fields: ['name', 'id']
      }
    },
    {
      type: 'array_item',
      fieldClasses: 'w-100',
      fieldItemsClasses: 'd-flex mt-2',
      newElementButtonLabelClasses: 'mt-2 p-2',
      inputAttributes: { class: 'k-input', style: { minWidth: '200px' } },
      removeElementButtonLabel: 'remove',
      placeholder: 'Enter a Path',
      styleClasses: 'w-100',
      inputType: 'text',
      valueType: 'array',
      valueArrayType: 'string',
      label: 'Path(s)',
      submitWhenNull: true,
      newElementButtonLabel: 'Add Path',
      visible: (model) => {
        const isVisible = model && !deepIncludes(['tcp', 'tls'], model.protocols)

        if (!isVisible) model.paths = null

        return isVisible
      }
    },
    {
      type: 'array_multi',
      fieldClasses: 'w-100',
      newElementButtonLabel: 'Add Field',
      fieldItemsClasses: 'pt-4',
      newElementButtonLabelClasses: 'meta-fields-add-field k-button btn-link mt-2 p-2',
      inputAttributes: { class: 'form-control', style: { minWidth: '200px' } },
      styleClasses: 'w-100',
      valueArrayType: 'string',
      label: 'Developer Meta Fields',
      fields: [
        {
          type: 'input',
          model: 'input',
          placeholder: 'Company Name, Personal Email ...etc',
          inputType: 'text',
          label: 'Label <span class="label-hint">User facing label for the input</span>',
          id: 'meta-fields-inputs'
        },
        {
          type: 'input',
          model: 'field_name',
          placeholder: 'company_name, personal_email ...etc',
          label: 'Field Name <span class="label-hint">Used by API/HTML to reference input value</span>',
          inputType: 'text',
          id: 'meta-fields-field-name'
        },
        {
          type: 'select',
          inputType: 'select',
          model: 'type_of_input',
          label: 'Type of Input <span class="label-hint">The type of the input requested from the user</span>',
          items: [
            { label: 'text', value: 'text' },
            { label: 'email', value: 'email' },
            { label: 'number', value: 'number' }
          ],
          id: 'meta-fields-type-of-input'
        },
        {
          type: 'checkbox',
          inputType: 'checkbox',
          label: 'Required <span class="label-hint">This field will be required to register</span>',
          model: 'required',
          id: 'meta-fields-required',
          class: 'go-left'
        }
      ]
    },
    {
      label: 'Headers',
      type: 'object_advanced',
      submitWhenNull: true,
      placeholder: 'Enter header name',
      help: 'One or more lists of values indexed by header name that will cause this Route to match if present in the request. The Host header cannot be used with this attribute: hosts should be specified using the hosts attribute.',
      buttonLabel: 'Header Values',
      hintText: 'e.g. my-header',
      fields: [
        {
          type: 'input',
          inputType: 'text',
          valueType: 'array',
          placeholder: 'Comma separated list of header values',
          hint: 'e.g. value1, value2, value 3'
        }
      ]
    }
  ]
}
