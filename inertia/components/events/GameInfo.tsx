// inertia/components/events/EventGameInfo.tsx - NEW COMPONENT
import { motion } from 'motion/react'
import {
  TrophyIcon,
  ClockIcon,
  UsersIcon,
  ShieldCheckIcon,
  BoltIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import Card from '~/components/ui/Card'
import Badge from '~/components/ui/Badge'
import { getDifficultyLabel, getIntensityLabel, getTeamRegistrationLabel } from '~/lib/constants'

interface GameInfo {
  gameType?: string | null
  difficulty?: string | null
  durationMinutes?: number | null
  physicalIntensity?: string | null
  allowsTeams?: boolean
  teamRegistration?: string | null
  minTeamSize?: number | null
  maxTeamSize?: number | null
  maxTeams?: number | null
  autoTeamFormation?: boolean
  requiredItems?: string[] | null
  prohibitedItems?: string[] | null
  safetyRequirements?: string[] | null
  waiverRequired?: boolean
  rulesDocumentUrl?: string | null
  checkInTime?: string | null
  briefingDurationMinutes?: number | null
  prizeInformation?: string | null
  prizePool?: number | null
  winnerAnnouncement?: string | null
  photographyAllowed?: boolean
  liveStreaming?: boolean
  specialInstructions?: string | null
  totalDurationMinutes?: number
}

interface Props {
  gameInfo: GameInfo
}

export default function EventGameInfo({ gameInfo }: Props) {
  if (!gameInfo.gameType) return null

  return (
    <div className="space-y-6">
      {/* Game Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <TrophyIcon className="w-7 h-7 text-primary-600" />
            Informations du jeu
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Game Type */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700">Type de jeu</label>
              <p className="text-neutral-900 font-medium">{gameInfo.gameType}</p>
            </div>

            {/* Difficulty */}
            {gameInfo.difficulty && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">Difficulté</label>
                <div>
                  <Badge
                    variant={
                      gameInfo.difficulty === 'extreme' || gameInfo.difficulty === 'hard'
                        ? 'error'
                        : gameInfo.difficulty === 'medium'
                          ? 'warning'
                          : 'success'
                    }
                  >
                    {getDifficultyLabel(gameInfo.difficulty)}
                  </Badge>
                </div>
              </div>
            )}

            {/* Duration */}
            {gameInfo.durationMinutes && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">Durée du jeu</label>
                <p className="text-neutral-900 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-primary-600" />
                  {gameInfo.durationMinutes} minutes
                  {gameInfo.briefingDurationMinutes &&
                    ` (+${gameInfo.briefingDurationMinutes} min de briefing)`}
                </p>
              </div>
            )}

            {/* Total Duration */}
            {gameInfo.totalDurationMinutes && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">Durée totale</label>
                <p className="text-neutral-900 font-medium">
                  {Math.floor(gameInfo.totalDurationMinutes / 60)}h{' '}
                  {gameInfo.totalDurationMinutes % 60}min
                </p>
              </div>
            )}

            {/* Physical Intensity */}
            {gameInfo.physicalIntensity && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">Intensité physique</label>
                <div>
                  <Badge
                    variant={
                      gameInfo.physicalIntensity === 'high'
                        ? 'error'
                        : gameInfo.physicalIntensity === 'medium'
                          ? 'warning'
                          : 'success'
                    }
                  >
                    {getIntensityLabel(gameInfo.physicalIntensity)}
                  </Badge>
                </div>
              </div>
            )}

            {/* Check-in Time */}
            {gameInfo.checkInTime && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">
                  Heure d'enregistrement
                </label>
                <p className="text-neutral-900">
                  {new Date(gameInfo.checkInTime).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Team Configuration */}
      {gameInfo.allowsTeams && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <UsersIcon className="w-6 h-6 text-primary-600" />
              Configuration des équipes
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                {gameInfo.teamRegistration && (
                  <Badge variant="info">
                    {getTeamRegistrationLabel(gameInfo.teamRegistration)}
                  </Badge>
                )}
                {gameInfo.autoTeamFormation && (
                  <Badge variant="success">🤝 Formation automatique</Badge>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {gameInfo.minTeamSize && (
                  <div>
                    <label className="text-sm text-neutral-600">Taille min.</label>
                    <p className="font-semibold text-neutral-900">{gameInfo.minTeamSize} joueurs</p>
                  </div>
                )}
                {gameInfo.maxTeamSize && (
                  <div>
                    <label className="text-sm text-neutral-600">Taille max.</label>
                    <p className="font-semibold text-neutral-900">{gameInfo.maxTeamSize} joueurs</p>
                  </div>
                )}
                {gameInfo.maxTeams && (
                  <div>
                    <label className="text-sm text-neutral-600">Nombre d'équipes max.</label>
                    <p className="font-semibold text-neutral-900">{gameInfo.maxTeams} équipes</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Prizes */}
      {(gameInfo.prizeInformation || gameInfo.prizePool) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card variant="gradient">
            <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <TrophyIcon className="w-6 h-6 text-warning-600" />
              Récompenses
            </h3>

            {gameInfo.prizePool && (
              <div className="mb-3">
                <Badge variant="warning" size="lg">
                  💰 Cagnotte: {gameInfo.prizePool.toLocaleString()} DZD
                </Badge>
              </div>
            )}

            {gameInfo.prizeInformation && (
              <p className="text-neutral-700 leading-relaxed">{gameInfo.prizeInformation}</p>
            )}

            {gameInfo.winnerAnnouncement && (
              <p className="text-sm text-neutral-600 mt-3">
                🎉 Annonce des gagnants:{' '}
                {new Date(gameInfo.winnerAnnouncement).toLocaleString('fr-FR')}
              </p>
            )}
          </Card>
        </motion.div>
      )}

      {/* Requirements */}
      {(gameInfo.requiredItems?.length || gameInfo.prohibitedItems?.length) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <InformationCircleIcon className="w-6 h-6 text-info-600" />
              Équipement & Restrictions
            </h3>

            <div className="space-y-6">
              {gameInfo.requiredItems && gameInfo.requiredItems.length > 0 && (
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-success-600" />
                    Objets requis
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {gameInfo.requiredItems.map((item, idx) => (
                      <Badge key={idx} variant="success">
                        ✓ {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {gameInfo.prohibitedItems && gameInfo.prohibitedItems.length > 0 && (
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                    <XCircleIcon className="w-5 h-5 text-error-600" />
                    Objets interdits
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {gameInfo.prohibitedItems.map((item, idx) => (
                      <Badge key={idx} variant="error">
                        ✕ {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Safety Requirements */}
      {gameInfo.safetyRequirements && gameInfo.safetyRequirements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card variant="bordered">
            <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="w-6 h-6 text-success-600" />
              Consignes de sécurité
            </h3>

            <ul className="space-y-3">
              {gameInfo.safetyRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-success-600 mt-0.5 shrink-0" />
                  <span className="text-neutral-700">{req}</span>
                </li>
              ))}
            </ul>

            {gameInfo.waiverRequired && (
              <div className="mt-4 p-3 bg-warning-50 border-l-4 border-warning-500 rounded">
                <p className="text-sm text-warning-800 font-medium">
                  ⚠️ Décharge de responsabilité requise
                </p>
              </div>
            )}

            {gameInfo.rulesDocumentUrl && (
              <div className="mt-4">
                <a
                  href={gameInfo.rulesDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
                >
                  📄 Consulter le règlement complet
                  <BoltIcon className="w-4 h-4" />
                </a>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Additional Information */}
      {(gameInfo.photographyAllowed !== undefined ||
        gameInfo.liveStreaming !== undefined ||
        gameInfo.specialInstructions) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card>
            <h3 className="text-xl font-bold text-neutral-900 mb-4">
              Informations supplémentaires
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {gameInfo.photographyAllowed ? (
                  <Badge variant="success">📷 Photos autorisées</Badge>
                ) : (
                  <Badge variant="error">📷 Photos interdites</Badge>
                )}
              </div>

              {gameInfo.liveStreaming && (
                <div className="flex items-center gap-3">
                  <Badge variant="info">📹 Streaming en direct</Badge>
                </div>
              )}

              {gameInfo.specialInstructions && (
                <div className="mt-4 p-4 bg-info-50 rounded-lg border-l-4 border-info-500">
                  <h4 className="font-semibold text-info-900 mb-2">📝 Instructions spéciales</h4>
                  <p className="text-info-800 leading-relaxed">{gameInfo.specialInstructions}</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
