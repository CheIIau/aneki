<template>
  <v-container>
    <v-layout row>
      <v-flex xs10
              offset-xs1
              sm8
              offset-sm2
              md6
              offset-md3>
        <h1 class="text--secondary mb-3 mt-3"
            align="center">
          Поделиться анекдотом
        </h1>
        <v-form ref="form"
                v-model="valid"
                validation
                class="mb-6">
          <v-text-field v-model.trim="title"
                        prepend-icon="mdi-format-title"
                        name="title"
                        label="Заголовок анека (если нужен)"
                        type="text"
                        :rules="titleRules"></v-text-field>
          <v-textarea v-model.trim="body"
                      prepend-icon="mdi-lock"
                      name="body"
                      label="Анекдот"
                      type="text"
                      counter="true"
                      auto-grow
                      rows="3"
                      :rules="[v => !!v || 'А где анек?']"></v-textarea>
        </v-form>
        <v-layout row
                  wrap>
          <v-flex xs12>
            <v-btn color="success"
                   :loading="loading"
                   :disabled="!valid || loading"
                   @click="createAnek">
              Добавить анек
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      title: '',
      body: '',
      valid: false,
      titleRules: [(v) => v.length <= 20 || 'Заголовок должен быть короче 20 символов'],
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
  },
  methods: {
    ...mapActions({ addAnek: 'addAnek' }),
    createAnek() {
      if (this.$refs.form.validate()) {
        const anek = {
          title: this.title,
          body: this.body,
        };
        this.addAnek(anek);
        this.$router.push('/');
      }
    },
  },
};
</script>