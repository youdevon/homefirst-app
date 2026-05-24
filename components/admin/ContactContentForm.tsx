import AdminMediaUrlField from "@/components/admin/AdminMediaUrlField";
import type { EditableContactContent } from "@/lib/contact-content-data";
import { getContactCardSlots } from "@/lib/contact-content-data";
import type { MediaSelectorOption } from "@/lib/media-data";

type ContactContentFormProps = {
  content: EditableContactContent;
  imageFiles: MediaSelectorOption[];
};

export default function ContactContentForm({
  content,
  imageFiles,
}: ContactContentFormProps) {
  const cardSlots = getContactCardSlots(content.cards);

  return (
    <form
      method="post"
      action="/api/admin/contact"
      className="admin-settings-form"
    >
      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Contact Hero</h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Eyebrow</span>
            <input
              type="text"
              name="hero_eyebrow"
              defaultValue={content.hero.eyebrow}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Background image URL</span>
            <AdminMediaUrlField
              name="hero_backgroundImageUrl"
              defaultValue={content.hero.backgroundImageUrl}
              options={imageFiles}
              required
              placeholder="/uploads/images/contact.jpg"
            />
          </label>

          <label className="admin-field">
            <span>Title</span>
            <input
              type="text"
              name="hero_title"
              defaultValue={content.hero.title}
              required
            />
          </label>

          <label className="admin-field">
            <span>Highlighted title</span>
            <input
              type="text"
              name="hero_highlightedTitle"
              defaultValue={content.hero.highlightedTitle}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Description</span>
            <textarea
              name="hero_description"
              defaultValue={content.hero.description}
              required
            />
          </label>
        </div>
      </div>

      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Contact Details</h2>
        <div className="admin-form-grid">
          <label className="admin-field admin-field-full">
            <span>Office name</span>
            <input
              type="text"
              name="details_officeName"
              defaultValue={content.details.officeName}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Address</span>
            <textarea
              name="details_address"
              defaultValue={content.details.address}
              required
            />
          </label>

          <label className="admin-field">
            <span>Phone</span>
            <input
              type="text"
              name="details_phone"
              defaultValue={content.details.phone}
              required
            />
          </label>

          <label className="admin-field">
            <span>Email</span>
            <input
              type="email"
              name="details_email"
              defaultValue={content.details.email}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Office hours</span>
            <input
              type="text"
              name="details_officeHours"
              defaultValue={content.details.officeHours}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Map embed URL</span>
            <input
              type="text"
              name="details_mapEmbedUrl"
              defaultValue={content.details.mapEmbedUrl}
              placeholder="https://www.google.com/maps/embed?..."
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Map link URL</span>
            <input
              type="text"
              name="details_mapUrl"
              defaultValue={content.details.mapUrl}
              placeholder="https://maps.google.com"
            />
          </label>
        </div>
      </div>

      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Instructions</h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Title</span>
            <input
              type="text"
              name="instructions_title"
              defaultValue={content.instructions.title}
              required
            />
          </label>

          <label className="admin-field">
            <span>Highlighted title</span>
            <input
              type="text"
              name="instructions_highlightedTitle"
              defaultValue={content.instructions.highlightedTitle}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Description</span>
            <textarea
              name="instructions_description"
              defaultValue={content.instructions.description}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Instruction items</span>
            <textarea
              name="instructions_items"
              defaultValue={content.instructions.items.join("\n")}
              required
              placeholder="One instruction per line"
            />
          </label>
        </div>
      </div>

      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Contact Cards</h2>
        <p className="admin-form-help">
          Manage quick-action cards shown on the contact page. Leave a card title
          empty to omit it.
        </p>

        {cardSlots.map((card, index) => (
          <div className="admin-card-slot" key={`contact-card-${index}`}>
            <h3 className="admin-card-slot-title">Card {index + 1}</h3>
            <div className="admin-form-grid">
              <label className="admin-field">
                <span>Title</span>
                <input
                  type="text"
                  name={`card_${index}_title`}
                  defaultValue={card.title}
                />
              </label>

              <label className="admin-field">
                <span>Icon</span>
                <input
                  type="text"
                  name={`card_${index}_icon`}
                  defaultValue={card.icon}
                  placeholder="🏢"
                />
              </label>

              <label className="admin-field">
                <span>Display order</span>
                <input
                  type="number"
                  name={`card_${index}_displayOrder`}
                  min={0}
                  defaultValue={card.displayOrder}
                />
              </label>

              <label className="admin-field">
                <span>Status</span>
                <select
                  name={`card_${index}_active`}
                  defaultValue={card.active ? "true" : "false"}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </label>

              <label className="admin-field admin-field-full">
                <span>Description</span>
                <textarea
                  name={`card_${index}_description`}
                  defaultValue={card.description}
                />
              </label>

              <label className="admin-field">
                <span>Link label</span>
                <input
                  type="text"
                  name={`card_${index}_linkLabel`}
                  defaultValue={card.linkLabel}
                />
              </label>

              <label className="admin-field">
                <span>Link URL</span>
                <input
                  type="text"
                  name={`card_${index}_linkHref`}
                  defaultValue={card.linkHref}
                  placeholder="/contact or tel:+18686123456"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          Save Contact Page
        </button>
      </div>
    </form>
  );
}
