<template>
  <div class="text-center">
    <v-dialog v-model="dialog"
              width="500"
              @click:outside="changeDialog">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          <slot name="header"></slot>
        </v-card-title>
        <v-img v-if="imageSrc"
               height="250"
               contain
               :src="imageSrc"></v-img>
        <slot name="modal-body"></slot>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary"
                 text
                 @click="changeDialog">
            Закрыть
          </v-btn>
          <slot name="button">
            ОК
          </slot>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
    },
    imageSrc: {},
  },
  data() {
    return {
      dialog: this.showDialog,
    };
  },
  watch: {
    showDialog() {
      if (this.dialog !== this.showDialog) {
        this.dialog = this.showDialog;
      }
    },
  },
  methods: {
    changeDialog() {
      this.dialog = false;
      this.$emit('toggleDialog');
    },
  },
};
</script>