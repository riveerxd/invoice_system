<template>
    <div>
        <h3>
            {{ $t('invoice_title') }}
            <AppEditable :value="invoice.number"
                         :errors="errors"
                         field="number"
                         :placeholder="$t('invoice_number')"
                         @change="updateProp({ number: $event })"/>
        </h3>
        {{ $t('issued_at') }}
        <span class="editable__item" v-b-modal.modal_issued_at>{{ invoice.issued_at | date('D. MMM YYYY', 'YYYY-MM-DD') }}</span>
        <BModal id="modal_issued_at"
                centered
                :title="$t('modal_issued_at_title')"
                hide-footer
                size="sm"
                content-class="bg-base dp--24">
            <AppDatePicker :value="invoice.issued_at"
                           @change="updateProp({ issued_at: $event })"
                           :errors="errors"
                           :inline="true"
                           field="issued_at"/>
        </BModal>
        <span :class="{'d-print-none': !invoice.tax_point_date}">
            <br>{{ $t('tax_point_date') }}
            <span v-if="invoice.tax_point_date" class="editable__item" v-b-modal.modal_tax_point_date>{{ invoice.tax_point_date | date('D. MMM YYYY', 'YYYY-MM-DD') }}</span>
            <span v-else class="editable__item text-muted d-print-none" v-b-modal.modal_tax_point_date>{{ $t('add_tax_point_date') }}</span>
            <BModal id="modal_tax_point_date"
                    centered
                    :title="$t('modal_tax_point_date_title')"
                    hide-footer
                    size="sm"
                    content-class="bg-base dp--24">
                <AppDatePicker :value="invoice.tax_point_date"
                               @change="updateProp({ tax_point_date: $event })"
                               :inline="true"
                               field="tax_point_date"/>
            </BModal>
        </span>
        <br>{{ $t('due_at') }}
        <span class="editable__item"
              v-b-modal.modal_due_at>{{ invoice.due_at | date('D. MMM YYYY', 'YYYY-MM-DD') }}</span>
        <BModal id="modal_due_at"
                centered
                :title="$t('modal_due_at_title')"
                hide-footer
                size="sm"
                content-class="bg-base dp--24">
            <AppDatePicker :value="invoice.due_at"
                           @change="updateProp({ due_at: $event })"
                           :errors="errors"
                           :inline="true"
                           field="due_at"/>
        </BModal>
        <span :class="{'d-print-none': !invoice.late_fee}">
            <br>{{ $t('late_fee') }}
            <AppEditable :value="invoice.late_fee | currency"
                         :errors="errors"
                         suffix="%"
                         field="late_fee"
                         :placeholder="$t('add_late_fee')"
                         @change="updateProp({ late_fee: $event })"/>
        </span>
    </div>
</template>
<script>
import { BModal, VBModal } from 'bootstrap-vue';
import AppEditable from '@/components/form/AppEditable';
import AppDatePicker from '@/components/form/AppDatePicker';
import { formatDate } from '@/filters/date.filter';
import { formatCurrency } from '@/filters/currency.filter';

export default {
  i18nOptions: { namespaces: 'invoice-header' },
  props: ['invoice', 'errors'],
  components: {
    AppEditable,
    AppDatePicker,
    BModal,
  },
  directives: {
    'b-modal': VBModal,
  },
  filters: {
    date: formatDate,
    currency: formatCurrency,
  },
  methods: {
    updateProp(props) {
      this.$emit('update', props);
    },
  },
};
</script>
