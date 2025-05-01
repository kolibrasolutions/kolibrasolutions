# Renomear favicon.png para favicon-32x32.png
Copy-Item "public/favicon.png" -Destination "public/favicon-32x32.png"

# Converter o favicon.png para .ico
# Como não temos uma ferramenta de conversão direta no PowerShell,
# vamos apenas copiar o arquivo PNG e renomear para .ico temporariamente
Copy-Item "public/favicon.png" -Destination "public/favicon.ico" 