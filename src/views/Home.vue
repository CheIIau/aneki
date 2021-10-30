<template>
  <v-app>
    <v-flex xs10
            offset-xs1
            sm8
            offset-sm2
            md6
            offset-md3>
      <v-card class="max-auto mb-7"
              v-for="anek in aneks"
              :key="anek.body">
        <v-card-text>
          <p class="text-h4 text--primary">
            {{anek.title}}
          </p>
          <div class="text--primary">
            {{anek.body}}
          </div>
          <v-row class="mr-1 mb-1 mt-2"
                 app>
            <v-spacer></v-spacer>
            <div>Автор: {{anek.author}}</div>
          </v-row>
        </v-card-text>
      </v-card>
    </v-flex>

  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: { ...mapGetters({ aneks: 'getAneks' }) },
};
</script>
