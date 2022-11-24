# Toxicity Middleware API
Simple Fastify API that implements the Tensorflow Toxicity model, will return a string array of the violations it found in the provided string.

```http
GET /toxicity
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `message` | `string` | **Required**. The message to check for toxicity |

## Response
The API sends the following response to a succesful call.
```javascript
{
  "violations": []
}
```

The `violations` property return an array of categories that the message violates.
The following categories are available:
- Identity Attack
- Insult
- Obscene
- Severe Toxicity
- Sexual Explicit
- Threat
- Toxicity

## Status Codes

Gophish returns the following status codes in its API:

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 400 | `BAD REQUEST` |
