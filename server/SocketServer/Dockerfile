# escape=`

#Base Image from Microsoft
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

#set up a directory in container
WORKDIR /scr

#copy sourceCode to /src folder on container
COPY . .

#restore nuget packages -- #RUN: Used to execute a command during the build process of the docker image
RUN dotnet restore

# copy and publish app and libraries
RUN dotnet publish -c release -o /app

#Expose Port
EXPOSE 8181

# final stage/image
FROM mcr.microsoft.com/dotnet/runtime:6.0
WORKDIR /app
COPY --from=build /app .

#Run the app
#ENTRYPOINT [ "dotnet", "run" ]
ENTRYPOINT ["dotnet", "SocketServer.dll"]

#docker image build -t socketserver .
#docker run -d --rm --name socketserver -p 8181:8181 socketserver


#aws lightsail push-container-image --region eu-central-1 --service-name socketserver --label socketserver --image socketserver