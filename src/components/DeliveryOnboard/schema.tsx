import type { Schema } from "formity";

const schema: Schema = [
  {
    form: {
      defaultValues: {
        name: ["", []],
        firstLastName: ["", []],
        secondLastName: ["", []],
        age: ["", []],
        telephone: ["", []],
      },
      resolver: {
        name: [
          [{ "#$ne": ["#$name", ""] }, "Requerido"],
          [{ "#$lt": [{ "#$strLen": "#$name" }, 20] }, "Maximo 20 caracteres"],
        ],
        firstLastName: [
          [{ "#$ne": ["#$firstLastName", ""] }, "Requerido"],
          [{ "#$lt": [{ "#$strLen": "#$firstLastName" }, 20] }, "Maximo 20 caracteres"],
        ],
        secondLastName: [
          [{ "#$ne": ["#$secondLastName", ""] }, "Requerido"],
          [{ "#$lt": [{ "#$strLen": "#$secondLastName" }, 20] }, "Maximo 20 caracteres"],
        ],
        age: [
          [{ "#$ne": ["#$age", ""] }, "Requerido"],
          [{ "#$gte": ["#$age", 18] }, "Debes ser mayor de 18 años"],
          [{ "#$lte": ["#$age", 100] }, "Debes ser menor de 100 años"],
        ],
        telephone: [
          [{ "#$ne": ["#$telephone", ""] }, "Requerido"],
          [{ "#$lte": [{ "#$strLen": "#$telephone" }, 10] }, "Maximo 10 caracteres"],
          [{ "#$gte": [{ "#$strLen": "#$telephone" }, 10] }, "Minimo 10 caracteres"],
        ],
      },
      render: {
        screen: {
          progress: { total: 3, current: 1 },
          children: {
            form: {
              step: "$step",
              defaultValues: "$defaultValues",
              resolver: "$resolver",
              onNext: "$onNext",
              children: {
                formLayout: {
                  heading: "Platicanos sobre ti",
                  description:
                    "Quisieramos saber un poco más sobre ti",
                  fields: [
                    {
                      row: {
                        columns: 3,
                        items: [
                          {
                            textField: {
                              name: "name",
                              label: "Nombre",
                            },
                          },
                          {
                            textField: {
                              name: "firstLastName",
                              label: "Primer Apellido",
                            },
                          },
                          {
                            textField: {
                              name: "secondLastName",
                              label: "Segundo Apellido",
                            },
                          },
                        ],
                      },
                    },
                    {
                      numberField: {
                        name: "age",
                        label: "Edad",
                      },
                    },
                    {
                      textField: {
                        name: 'telephone',
                        label: 'Teléfono',
                      }
                    }
                  ],
                  button: {
                    next: { text: "Siguiente" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  {
    form: {
      defaultValues: {
        vehicle: ["motorcycle", []],
      },
      resolver: {},
      render: {
        screen: {
          progress: { total: 3, current: 2 },
          children: {
            form: {
              step: "$step",
              defaultValues: "$defaultValues",
              resolver: "$resolver",
              onNext: "$onNext",
              children: {
                formLayout: {
                  heading: "Que tipo de vehículo usas?",
                  description:
                    "Para darte un mejor servicio, necesitamo saber que tipo de vehículo usas",
                  fields: [
                    {
                      select: {
                        name: "vehicle",
                        label: "Vehículo",
                        options: [
                          {
                            value: "motorcycle",
                            label: "Motocicleta",
                          },
                          {
                            value: "bicycle",
                            label: "Bicicleta",
                          },
                        ],
                      }
                    },
                  ],
                  button: {
                    next: { text: "Siguiente" },
                  },
                  back: {
                    back: { onBack: "$onBack" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  {
    cond: {
      if: { $eq: ["$vehicle", "motorcycle"] },
      then: [
        {
          form: {
            defaultValues: {
              vehicleRegistration: ["", []],
              motorType: ["", []],
            },
            resolver: {},
            render: {
              screen: {
                progress: { total: 3, current: 3 },
                children: {
                  form: {
                    step: "$step",
                    defaultValues: "$defaultValues",
                    resolver: "$resolver",
                    onNext: "$onNext",
                    children: {
                      formLayout: {
                        heading:
                          "Danos mas información sobre tu vehículo",
                        description:
                          "Entre mas información tengamos sobre tu vehículo mejor te podemos ayudar",
                        fields: [
                          {
                            textField: {
                              name: "vehicleRegistration",
                              label: "Matricula",
                            },
                          },
                          {
                            textField: {
                              name: 'motorType',
                              label: 'Tipo de motor (CC)',
                            },
                          }
                        ],
                        button: {
                          next: { text: "Siguiente" },
                        },
                        back: {
                          back: { onBack: "$onBack" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          return: {
            name: '$name',
            firstLastName: '$firstLastName',
            secondLastName: '$secondLastName',
            age: "$age",
            vehicle: "$vehicle",
            vehicleRegistration: "$vehicleRegistration",
            motorType: "$motorType",
            telephone: "$telephone",
          },
        },
      ],
      else: [
        {
          return: {
            name: '$name',
            firstLastName: '$firstLastName',
            secondLastName: '$secondLastName',
            age: "$age",
            vehicle: "$vehicle",
            vehicleRegistration: null,
            motorType: null,
            telephone: "$telephone",
          },
        },
      ],
    },
  },
];

export default schema;
