import { FastifyPluginAsync } from 'fastify'
import '@tensorflow/tfjs-node'
import * as toxicity from '@tensorflow-models/toxicity'

interface ToxicityResult {
  text: string
  identity_attack?: boolean
  insult?: boolean
  obscene?: boolean
  obsene?: boolean
  severe_toxicity?: boolean
  sexual_explicit?: boolean
  threat?: boolean
  toxicity?: boolean
  [key: string]: boolean | undefined | string
}

class Toxicity {
  model: toxicity.ToxicityClassifier | undefined

  constructor(treshold: number) {
    this.loadModel(treshold)
  }

  async loadModel(treshold: number) {
    this.model = await toxicity.load(treshold, [])
  }
  async classify(inputs: string[]) {
    return classify.call(this, inputs)
  }
}

const queryStringSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' }
  },
  required: ['message']
}

const options = {
  schema: {
    querystring: queryStringSchema
  }
}

const toxicityModel = new Toxicity(0.85)

async function classify(inputs: string[]): Promise<ToxicityResult[]> {
  if (toxicityModel.model) {
    const results = await toxicityModel.model.classify(inputs)

    return inputs.map((dex, size) => {
      const obj: ToxicityResult = { text: dex }

      for (const classification of results) {
        obj[classification.label] = classification.results[size].match
      }

      return obj
    })
  }

  return []
}

interface IQueryParams {
  message: string
}

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })

  fastify.get<{ Querystring: IQueryParams }>('/toxicity', options, async function (request, reply) {
    const { message } = request.query
    const results = await classify([message])

    const violations = []

    for (const result of results) {
      if (result.identity_attack) {
        violations.push('Identity Attack')
      }
      if (result.insult) {
        violations.push('Insult')
      }

      if (result.obscene) {
        violations.push('Obscene')
      }

      if (result.obsene) {
        violations.push('Obsene')
      }

      if (result.severe_toxicity) {
        violations.push('Severe Toxicity')
      }

      if (result.sexual_explicit) {
        violations.push('Sexual Explicit')
      }

      if (result.threat) {
        violations.push('Threat')
      }

      if (result.toxicity) {
        violations.push('Toxicity')
      }
    }

    return { violations }
  })
}

export default root;
