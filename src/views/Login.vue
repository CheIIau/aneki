<template>
  <v-container fluid>
    <v-layout align-self-baseline
              justify-center>
      <v-flex xs12
              sm8
              md6>
        <v-card class="elevation-12">
          <v-toolbar dark
                     color="primary">
            <v-toolbar-title>Войти</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form"
                    v-model="valid"
                    validation>
              <v-text-field v-model="email"
                            prepend-icon="mdi-at"
                            name="email"
                            label="Email"
                            type="email"
                            :rules="emailRules"></v-text-field>
              <v-text-field v-model="password"
                            prepend-icon="mdi-lock"
                            name="password"
                            label="Пароль"
                            type="current-password"
                            :counter="true"
                            :rules="passwordRules"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary"
                   :loading="loading"
                   :disabled="!valid || loading"
                   @click="onSubmit">
              Войти
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      password: '',
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 8) || 'Пароль должен быть длиннее 8 символов',
      ],
      email: '',
      emailRules: [(v) => !!v || 'Нужно ввести Email', (v) => /.+@.+\..+/.test(v) || 'Email должен быть корректным'],
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
  },
  created() {
    if (this.$route.query['loginError']) {
      this.$store.dispatch('setError', 'Войдите, чтобы получить доступ к этой странице');
    }
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        const user = {
          email: this.email,
          password: this.password,
        };
        this.$store
          .dispatch('loginUser', user)
          .then(() => {
            this.$router.push('/');
          })
          .catch(() => {});
      }
    },
  },
};
</script>