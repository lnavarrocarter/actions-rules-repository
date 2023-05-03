# Rules Engine Repository Actions

## Usage

```yml
name: Testing Actions Rules Repository
on: 
    push:
        branches:
        - main
  
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name : Testing Actions Rules Repository
        uses: lnavarrocarter/actions-rules-repository@v1.0.0
        with:
          labels: |
            label1
            label2
            label3
          repo: ${{ github.repository }}
          number: 4
          github_token: ${{ secrets.GITHUB_TOKEN }}
```


## Contacto

Este proyecto fue creado por Nacho Navarro. Si tienes alguna pregunta o sugerencia, puedes contactarme en lnavarro.carter@gmail.com.


## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para obtener más detalles.