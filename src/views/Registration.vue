<template>
  <v-container fluid>
    <v-layout
      align-self-baseline
      justify-center
    >
      <v-flex
        xs12
        sm8
        md6
      >
        <v-card class="elevation-12">
          <v-toolbar
            dark
            color="primary"
          >
            <v-toolbar-title>Регистрация</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form
              ref="formReg"
              v-model="valid"
              lazy-validation
            >
              <v-text-field
                v-model="nickname"
                prepend-icon="mdi-account"
                name="nickname"
                label="Никнейм"
                type="nickname"
                :rules="nicknameRules"
              ></v-text-field>
              <v-text-field
                v-model="email"
                prepend-icon="mdi-at"
                name="email"
                label="Email"
                type="email"
                :rules="emailRules"
              ></v-text-field>
              <v-text-field
                v-model="password"
                prepend-icon="mdi-lock"
                name="password"
                label="Пароль"
                type="password"
                :counter="true"
                :rules="passwordRules"
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                prepend-icon="mdi-lock"
                name="confirm-password"
                label="Подтвердите пароль"
                type="password"
                :counter="true"
                :rules="confirmPasswordRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="!valid || loading"
              @click="onSubmit"
            >
              Регистрация
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      valid: false,
      nickname: '',
      nicknameRules: [
        (v) => !!v || 'Нужно ввести никнейм',
        (v) => (v && v.length >= 3 && v.length <= 20) || 'Никнейм должен быть длиннее 3 и короче 20 символов',
        (v) => /^[A-zА-я0-9]+([-_]?[A-zА-я0-9]+){0,2}$/i.test(v) || 'Никнейм не может содержать  символы кроме - и _',
      ],
      email: '',
      emailRules: [(v) => !!v || 'Нужно ввести Email', (v) => /.+@.+\..+/.test(v) || 'Email должен быть валидным'],
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
  computed: {
    ...mapGetters(['loading']),
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
        this.registerUser(user).then(this.$router.push('/'));
      }
    },
  },
};
</script>