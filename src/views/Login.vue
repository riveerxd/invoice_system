<template>
    <div class="login-page min-vh-100 d-flex align-items-center justify-content-center">
        <div class="login-box card bg-base dp--02">
            <div class="card-body p-4">
                <h4 class="mb-4">Invoices</h4>
                <form @submit.prevent="submit">
                    <div class="form-group">
                        <label>Username</label>
                        <input v-model="username"
                               type="text"
                               class="form-control"
                               :class="{ 'is-invalid': error }"
                               autocomplete="username"
                               autofocus/>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input v-model="password"
                               type="password"
                               class="form-control"
                               :class="{ 'is-invalid': error }"
                               autocomplete="current-password"/>
                        <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
                    </div>
                    <button type="submit"
                            class="btn btn-primary btn-block mt-3"
                            :disabled="loading">
                        {{ loading ? 'Signing in…' : 'Sign in' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: '',
      loading: false,
    };
  },
  methods: {
    async submit() {
      this.error = '';
      this.loading = true;
      try {
        const res = await axios.post('/api/auth/login', {
          username: this.username,
          password: this.password,
        });
        localStorage.setItem('token', res.data.token);
        this.$router.push('/invoices');
      } catch (err) {
        this.error = (err.response && err.response.data && err.response.data.error) || 'Login failed';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-box {
    width: 100%;
    max-width: 380px;
}
</style>
