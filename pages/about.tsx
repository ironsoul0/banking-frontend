import React from "react";

const AboutPage = () => {
  return (
    <div className="w-full max-w-lg py-5 mx-auto">
      <h3 className="text-3xl font-bold">About</h3>
      <div className="text-lg">
        <p className="mt-3 text-lg">
          This project is a final submission for HalykAcademy Go course.
        </p>
        <p className="mt-4 mb-3 text-lg leading-6">
          Backend for the Banking website consists of two microservices written
          in Go:
        </p>
        <a
          href="https://github.com/ironsoul0/go-halyk-project"
          className="p-0 m-0 text-blue-500"
          target="_blank"
          rel="noreferrer"
        >
          Authentication microservice
        </a>
        <br />
        <a
          href="https://github.com/ironsoul0/transaction-service"
          className="text-blue-500"
          style={{ marginTop: "-10px" }}
          target="_blank"
          rel="noreferrer"
        >
          Transactions microservice
        </a>
        <br />
        <p className="mt-3">
          Code for the frontend can be found{" "}
          <a
            className="text-blue-500"
            href="https://github.com/ironsoul0/banking-frontend"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          .
        </p>
        <p className="mt-3">Thanks!</p>
      </div>
    </div>
  );
};

export default AboutPage;
