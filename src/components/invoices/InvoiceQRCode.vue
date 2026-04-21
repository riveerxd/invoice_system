<template>
    <div v-if="spayd" class="invoice-qr mt-3">
        <canvas ref="qrCanvas"></canvas>
        <div class="invoice-qr__label">{{ $t('qr_payment') }}</div>
    </div>
</template>

<script>
import QRCode from 'qrcode';
import { buildSpayd } from '@/utils/spayd';

export default {
  i18nOptions: { namespaces: 'invoice-bank-details' },
  props: ['invoice'],
  computed: {
    spayd() {
      if (!this.invoice || !this.invoice.bank_account_no) return null;
      return buildSpayd({
        accountNo: this.invoice.bank_account_no,
        amount: this.invoice.total,
        currency: this.invoice.currency,
        variableSymbol: this.invoice.variable_symbol || this.invoice.number,
        dueDate: this.invoice.due_at,
        message: this.invoice.number,
      });
    },
  },
  watch: {
    spayd() {
      this.renderQR();
    },
  },
  mounted() {
    this.renderQR();
  },
  methods: {
    renderQR() {
      this.$nextTick(() => {
        if (this.$refs.qrCanvas && this.spayd) {
          QRCode.toCanvas(this.$refs.qrCanvas, this.spayd, {
            width: 100,
            margin: 1,
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.invoice-qr__label {
    font-size: 0.75rem;
    text-align: center;
    margin-top: 2px;
}
</style>
