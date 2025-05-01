
# Renomear favicon.png para favicon-32x32.png
Copy-Item "public/favicon.png" -Destination "public/favicon-32x32.png"

# Converter o favicon.png para uma cópia em .ico formato
Copy-Item "public/favicon.png" -Destination "public/favicon.ico" 

# Criar uma versão menor de 16x16
Copy-Item "public/favicon.png" -Destination "public/favicon-16x16.png"

# Nota: Para melhor compatibilidade, recomenda-se converter o favicon.ico usando
# uma ferramenta externa de conversão de imagem para garantir o formato .ico correto
Write-Host "Aviso: Para garantir máxima compatibilidade, é recomendado converter favicon.ico usando uma ferramenta de conversão específica."
