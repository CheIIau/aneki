<template>
  <v-container fluid>
    <v-layout align-self-baseline
              justify-center>
      <v-flex xs12
              sm8
              md6
              text-center
              fill-height>
        <h1 class="text-h3 primary--text">
          Страница не найдена
        </h1>
        <br>
        <hr>
        <br>
        <v-btn text
               elevation="1"
               outlined
               color="primary"
               class="v-btn"
               :to="'/'">
          <span class="v-btn__content"> Прочь отсюда</span>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {};
</script>