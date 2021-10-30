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
            <v-toolbar-title>Регистрация</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid"
                    ref="formReg"
                    lazy-validation>
              <v-text-field prepend-icon="mdi-account"
                            name="nickname"
                            label="Никнейм"
                            type="nickname"
                            v-model="nickname"
                            :rules="nicknameRules"></v-text-field>
              <v-text-field prepend-icon="mdi-at"
                            name="email"
                            label="Email"
                            type="email"
                            v-model="email"
                            :rules="emailRules"></v-text-field>
              <v-text-field prepend-icon="mdi-lock"
                            name="password"
                            label="Пароль"
                            type="new-password"
                            :counter="true"
                            v-model="password"
                            :rules="passwordRules"></v-text-field>
              <v-text-field prepend-icon="mdi-lock"
                            name="confirm-password"
                            label="Подтвердите пароль"
                            type="new-password"
                            :counter="true"
                            v-model="confirmPassword"
                            :rules="confirmPasswordRules"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary"
                   @click="onSubmit"
                   :disabled="!valid">Регистрация</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      valid: false,
      nickname: '',
      nicknameRules: [
        (v) => !!v || 'Нужно ввести никнейм',
        (v) => (v && v.length >= 3 && v.length <= 20) || 'Никнейм должен быть длиннее 3 и короче 20 символов',
        (v) => /^[A-zА-я0-9]+([-_]?[A-zА-я0-9]+){0,2}$/i.test(v) || 'Никнейм не может сожержать  символы кроме - и _',
      ],
      email: '',
      emailRules: [(v) => !!v || 'Нужно ввести Email', (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'],
      password: '',
      passwordRules: [
        (v) => !!v || 'Нужно ввести пароль',
        (v) => (v && v.length >= 8) || 'Пароль должен быть длиннее 8 символов',
      ],
      confirmPassword: '',
      confirmPasswordRules: [
        (v) => !!v || 'Подтвердите пароль',
        (v) => v === this.password || 'Пароли должны совпадать',
      ],
    };
  },
  methods: {
    ...mapActions(['registerUser', 'clearError']),
    onSubmit() {
      if (this.$refs.formReg.validate()) {
        const user = {
          email: this.email,
          password: this.password,
          nickname: this.nickname,
        };

        try {
          this.registerUser(user).then(this.$router.push('/'));
        } catch (error) {
          setTimeout(() => {
            this.clearError();
          }, 4000);
        }
      }
    },
  },
};

//  <v-btn color="primary"
//                    @click="onSubmit"
//                    :loading="loading"
//                    :disabled="!valid || loading">Регистрация</v-btn>
</script>