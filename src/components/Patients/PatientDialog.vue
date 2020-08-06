<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
        <v-icon small>mdi-face</v-icon>
        <span class="patient-icon-text">Novo Paciente</span>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">
          <v-icon big color="primary">mdi-face</v-icon>
          <span v-if="!editing" class="patient-icon-text">Cadastrar Paciente</span>
          <span v-else class="patient-icon-text">Paciente</span>
        </span>
      </v-card-title>
      <v-card-text>
        <v-tabs v-model="patientTabs">
          <v-tab>Cadastro</v-tab>
          <v-tab :disabled="!editing">Ficha de Evolução</v-tab>
        </v-tabs>
        <v-tabs-items v-model="patientTabs">
          <v-tab-item>
            <v-container>
              <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
              <v-alert v-if="success" type="success">{{ successMessage }}</v-alert>
              <v-alert v-if="error" type="error">{{ errorMessage }}</v-alert>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Nome Completo" v-model="patient.name" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="CPF" v-model="patient.cpf" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Data de Nascimento" v-model="patient.birth" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Telefone" v-model="patient.phone" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Indicado Por" v-model="patient.appointed_by" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
          <v-tab-item></v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="closeDialog()">Fechar</v-btn>
        <v-btn
          color="primary darken-1"
          text
          @click="editing ? editPatient(patient.id, patient) : createPatient(patient)"
        >Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "patient-dialog",
  props: {
    patient: {},
  },
  data() {
    return {
      patientTabs: null,
      dialog: false,
      loading: false,
      editing: false,
      error: false,
      errorMessage: "",
      success: false,
      successMessage: "",
      patientObj: {
        id: null,
        name: "",
        cpf: "",
        birth: "",
        phone: "",
        appointed_by: "",
      },
    };
  },
  methods: {
    closeDialog() {
      this.success = false;
      this.successMessage = "";

      this.error = false;
      this.errorMessage = "";

      this.patient = Object.assign({}, this.patientObj);
      this.editing = false;
      console.log(this.patient);
      this.dialog = false;
    },

    async createPatient(newPatient) {
      this.success = false;
      this.successMessage = "";

      this.showSaveLoading = true;

      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
          {
            method: "POST",
            body: JSON.stringify(newPatient),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          }
        );

        const data = await response.json();

        this.success = true;
        this.successMessage = "Paciente criado com sucesso!";

        this.patient.id = data.id;
        this.editing = true;

        this.showSaveLoading = false;

        this.$emit("push:patient", data);
      } catch (error) {
        console.error(error);
      }
    },

    async editPatient(id, patient) {
      this.success = false;
      this.successMessage = "";

      this.showSaveLoading = true;

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${id}`,
          {
            method: "PUT",
            body: JSON.stringify(patient),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          }
        );

        const data = await response.json();

        this.patients = this.patients.map((patient) =>
          patient.id === id ? data : patient
        );

        this.success = true;
        this.successMessage = "Paciente salvo com sucesso!";

        this.showSaveLoading = false;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>>